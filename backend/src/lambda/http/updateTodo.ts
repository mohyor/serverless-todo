import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { updateToDo } from '../../businessLogic/toDo'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

   // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
    console.log("[Event Type] ", event)

    const authorization = event.headers.Authorization
  const jwtToken = authorization.split(" ")[1]

  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const todoItem = await updateToDo(updatedTodo, todoId, jwtToken)

  return {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
        "item": todoItem
    }),
}
}
