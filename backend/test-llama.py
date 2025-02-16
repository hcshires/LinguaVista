import ollama

# response = ollama.chat(
#     model="llama3",
#     messages=[
#         {
#             "role": "user",
#             "content": "Tell me an interesting fact about elephants",
#         },
#     ],
# )
# # print(response["message"]["content"])
# print(response)


import asyncio
from ollama import AsyncClient

async def chat():
    """
    Stream a chat from Llama using the AsyncClient.
    """
    message = {
        "role": "user",
        "content": "Tell me an interesting fact about elephants"
    }
    async for part in await AsyncClient().chat(
        model="llama3", messages=[message], stream=True
    ):
        print(part["message"]["content"], end="", flush=True)


asyncio.run(chat())

