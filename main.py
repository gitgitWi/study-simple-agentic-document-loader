if __name__ == "__main__":
    import uvicorn

    print("Run server...", end="\n\n")
    uvicorn.run("server:app", host="localhost", port=8000, reload=True)
