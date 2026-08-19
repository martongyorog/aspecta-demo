import os

from flask import Flask, jsonify

application = Flask(__name__)


@application.get("/api/message")
def message():
    return jsonify(
        message=os.getenv("APP_MESSAGE", "Hello from the Aspecta Demo backend!"),
        environment=os.getenv("APP_ENV", "local"),
    )


@application.get("/health")
def health():
    return jsonify(status="ok")


if __name__ == "__main__":
    application.run(host="0.0.0.0", port=5000)
