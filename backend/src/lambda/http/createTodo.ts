import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { deleteToDo } from '../../businessLogic/toDo'

// TODO: Remove a TODO item by id
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("[Event Type] ", event)
  
  const authorization = event.headers.Authorization
  const jwtToken = authorization.split(" ")[1]

  const todoId = event.pathParameters.todoId
  const deleteData = await deleteToDo(todoId, jwtToken)
    
  return {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    body: deleteData,
  }
}


