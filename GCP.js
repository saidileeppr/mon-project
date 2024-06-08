const {
    FunctionDeclarationSchemaType,
    VertexAI, Part

  } = require('@google-cloud/vertexai');
  const {BigQuery} = require('@google-cloud/bigquery');
  
  const project = 'sqltalk-425710';
  const location = 'us-central1';
  const textModel =  'gemini-1.5-pro';
  const vertexAI = new VertexAI({project: project, location: location});
  
  // Instantiate Gemini models
let BIGQUERY_DATASET_ID ='DS1';
const generativeModel = vertexAI.getGenerativeModel({
  model: textModel,
   generationConfig: {"temperature": 0},
});

const listDatasetsFunc=
      {
    name:"list_datasets",
    description:"Get a list of datasets that will help answer the user's question",
    parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {}
        }
    }


const listTablesFunc=
      {
    name:"list_tables",
    description:"List tables in a dataset that will help answer the user's question",
    parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            dataset_id:{
                type:FunctionDeclarationSchemaType.STRING,
                description: "Dataset ID to fetch tables from."
            }
          },
          required: ["dataset_id"],
        }
    }

const getTableFunc=
{
    name:"get_table",
    description:"Get information about a table, including the description, schema, and number of rows that will help answer the user's question. Always use the fully qualified dataset and table names.",
    parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            table_id:{
                type:FunctionDeclarationSchemaType.STRING,
                description: "Fully qualified ID of the table to get information about"
            }
          },
          required: ["table_id"],
        }
    }

const sqlQueryFunc={
    name:"sql_query",
    description:"Get information from data in BigQuery using SQL queries",
    parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            query:{
                type:FunctionDeclarationSchemaType.STRING,
                description: "SQL query on a single line that will help give quantitative answers to the user's question when run on a BigQuery dataset and table. In the SQL query, always use the fully qualified dataset and table names."
            }
          },
          required: ["query"]
        }
    }


//client.getDatasets({project}).then((ds)=>{console.log(ds)});
async function functionCallingChat() {
    // Create a chat session and pass your function declarations
    const chat = await generativeModel.startChat({tools:[{functionDeclarations:[listDatasetsFunc,listTablesFunc,getTableFunc,sqlQueryFunc
    ]}]});
    let prompt= 'What is average salary of the employee?';
    prompt += "Please give a concise, high-level summary followed by detail in plain language about where the information in your response is coming from in the database. Only use information that you learn from BigQuery, do not make up information.";
    let response=await chat.sendMessage(prompt);
    console.log(JSON.stringify(response));
    response=response["response"]["candidates"][0]["content"]["parts"][0];
    let function_calling_in_process = true;
    let api_requests_and_responses=[];
    const bigquery=new BigQuery();
    while(function_calling_in_process){
      try{
        let api_response=[];
        let params={};
        for (let [key, value] of Object.entries(response["functionCall"]["args"])) {
          params[key] = value;
      }
      console.log(params);
      console.log(response.functionCall.name);
      if(response.functionCall.name == "list_datasets"){
        let [datasetList] = await bigquery.getDatasets({ project })
        datasetList.forEach(dataset => api_response.push(dataset.id));
        api_requests_and_responses.concat([response.functionCall.name, params, api_response]);
      }
      if(response.functionCall.name == "list_tables"){
        const [tables] = await bigquery.dataset(params['dataset_id']).getTables();
        tables.forEach(dataset => api_response.push(dataset.id));
        api_requests_and_responses.concat([response.functionCall.name, params, api_response]);
      }
      if(response.functionCall.name == "get_table"){
        let string = params['table_id'];
  let [prefix, suffix] = string.split('.');
  console.log(prefix); // Output: DS1
  console.log(suffix); // Output: Employees
        const dataset = await bigquery.dataset(prefix);
        const [table] = await dataset.table(suffix).get();
        api_response=table.metadata.tableReference;
        api_requests_and_responses.concat([response.functionCall.name, params, api_response]);
      }
      if(response.functionCall.name == "sql_query"){
        let cleanedQuery=params["query"].replace("\\n", " ")
        .replace("\n", "")
        .replace("\\", "");
        const [job] = await bigquery.createQueryJob({query:cleanedQuery});
    // Wait for the query to finish
    const [rows] = await job.getQueryResults();
    // Print the results
    console.log('Rows:');
    rows.forEach(row => api_response.push(row));
    function_calling_in_process=false;
      }
      console.log(api_response);
      response=await chat.sendMessage([
        {
          functionResponse: {
            name: response.functionCall.name,
            response:
                {content: api_response},
          },
        },
      ]);
      console.log(JSON.stringify(response));
      response=response["response"]["candidates"][0]["content"]["parts"][0];
      console.log(response);
      }
      catch(err){
        function_calling_in_process=false;
        console.log(err);
      }
    
    }
    
  }
  
  functionCallingChat();


