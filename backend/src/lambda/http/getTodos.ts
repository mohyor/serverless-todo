import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getAllToDo } from '../../businessLogic/toDo'

// TODO: Get all TODO items for a current user
export const handler:APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>=>{
    console.log("[Event Type] ", event)
    
    const authorization = event.headers.Authorization
  const jwtToken = authorization.split(" ")[1]

  const toDos = await getAllToDo(jwtToken)

  return {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
        "items": toDos,
    }),
  }
}