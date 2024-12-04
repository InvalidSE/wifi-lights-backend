import websockets
import uuid
import asyncio

print("Testing Websockets")

async def ws_loop():
    # uri = "ws://invalidse-wifi-lights.host.qrl.nz"
    uri = "ws://localhost:3000"
    async with websockets.connect(uri) as websocket:
        print("Connected to server")
        await websocket.send(uuid.uuid4().hex)
        while True:
            message = await websocket.recv()
            print(f"Received message: {message}")


if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(ws_loop())
    loop.close()


    