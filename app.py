from flask import Flask, request, jsonify
import os
import subprocess
import json

app = Flask(__name__)

UPLOAD_FOLDER = "uploads/"
OUTPUT_FOLDER = "output/"  # YOLO 결과 저장 폴더
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image part"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # YOLO 탐지 실행
    detect_command = [
        "python", "detect.py",
        "--source", file_path,
        "--output", OUTPUT_FOLDER,
        "--cfg", "models/yolor_p6.cfg",
        "--weights", "models/last.pt",
        "--conf-thres", "0.01",
        "--iou-thres", "0.5",
        "--device", "0",
        "--names", "models/newconn.names",
        "--agnostic-nms",
        "--save-txt"
    ]

    subprocess.run(detect_command)

    # 결과 JSON 파일 확인
    result_json_path = os.path.join(OUTPUT_FOLDER, "results.json")
    
    if not os.path.exists(result_json_path):
        return jsonify({"error": "Detection failed or results.json not found"}), 500

    # JSON 파일 읽어서 클라이언트에게 반환
    with open(result_json_path, "r") as json_file:
        detection_results = json.load(json_file)

    # 👉 이미지 경로 키를 제거하고 리스트만 반환
    processed_results = list(detection_results.values())[0]

    return jsonify(processed_results)  # 깔끔한 JSON 데이터 반환

@app.route("/results", methods=["GET"])
def get_results():
    """ AI 분석 결과를 반환하는 엔드포인트 """
    result_json_path = os.path.join(OUTPUT_FOLDER, "results.json")

    if not os.path.exists(result_json_path):
        return jsonify({"error": "No results available"}), 404

    with open(result_json_path, "r") as json_file:
        detection_results = json.load(json_file)

    return jsonify(detection_results)  # JSON 데이터 반환

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)