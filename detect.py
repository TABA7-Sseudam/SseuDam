import argparse
import os
import platform
import shutil
import time
import json
from pathlib import Path

import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random

from utils.datasets import LoadStreams, LoadImages
from utils.general import (
    check_img_size, non_max_suppression, apply_classifier, scale_coords, xyxy2xywh, strip_optimizer)
from utils.plots import plot_one_box
from utils.torch_utils import select_device, load_classifier, time_synchronized

from models.models import *

def load_classes(path):
    with open(path, 'r') as f:
        names = f.read().split('\n')
    return list(filter(None, names))

def detect(save_img=False):
    out, source, weights, view_img, save_txt, imgsz, cfg, names = \
        opt.output, opt.source, opt.weights, opt.view_img, opt.save_txt, opt.img_size, opt.cfg, opt.names
    webcam = source == '0' or source.startswith('rtsp') or source.startswith('http') or source.endswith('.txt')

    device = select_device('cpu')  # Use CPU
    if os.path.exists(out):
        shutil.rmtree(out)
    os.makedirs(out)
    
    half = device.type != 'cpu'  # Half precision only on CUDA
    model = Darknet(cfg, imgsz).to('cpu')
    model.load_state_dict(torch.load(weights[0], map_location=device, weights_only=False)['model'])
    model.to(device).eval()
    if half:
        model.half()

    dataset = LoadStreams(source, img_size=imgsz) if webcam else LoadImages(source, img_size=imgsz, auto_size=64)
    names = load_classes(names)
    colors = [[random.randint(0, 255) for _ in range(3)] for _ in range(len(names))]

    results = {}  # JSON 결과 저장용

    for path, img, im0s, vid_cap in dataset:
        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()
        img /= 255.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        pred = model(img, augment=opt.augment)[0]
        pred = non_max_suppression(pred, opt.conf_thres, opt.iou_thres, classes=opt.classes, agnostic=opt.agnostic_nms)

        image_results = []  # 각 이미지에 대한 결과 저장

        for i, det in enumerate(pred):
            p, s, im0 = (path[i], '%g: ' % i, im0s[i].copy()) if webcam else (path, '', im0s)
            save_path = str(Path(out) / Path(p).name)
            txt_path = str(Path(out) / Path(p).stem)

            gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  # whwh normalization
            if det is not None and len(det):
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()

                for *xyxy, conf, cls in det:
                    bbox = {
                        "class": names[int(cls)],
                        "confidence": float(conf),
                        "bbox": [int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])]
                    }
                    image_results.append(bbox)

                    if save_img or view_img:
                        label = f"{names[int(cls)]} {conf:.2f}"
                        plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=3)

            results[p] = image_results

            if save_img:
                cv2.imwrite(save_path, im0)

    # JSON 저장
    with open(os.path.join(out, "results.json"), "w") as f:
        json.dump(results, f, indent=4)

    print(f"Results saved to {os.path.join(out, 'results.json')}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--weights', nargs='+', type=str, default='yolor_p6.pt', help='model.pt path(s)')
    parser.add_argument('--source', type=str, default='inference/images', help='source')
    parser.add_argument('--output', type=str, default='inference/output', help='output folder')
    parser.add_argument('--img-size', type=int, default=1280, help='inference size (pixels)')
    parser.add_argument('--conf-thres', type=float, default=0.4, help='object confidence threshold')
    parser.add_argument('--iou-thres', type=float, default=0.5, help='IOU threshold for NMS')
    parser.add_argument('--device', default='', help='cuda device, i.e. 0 or 0,1,2,3 or cpu')
    parser.add_argument('--view-img', action='store_true', help='display results')
    parser.add_argument('--save-txt', action='store_true', default=False, help='save results to *.txt')
    parser.add_argument('--classes', nargs='+', type=int, help='filter by class: --class 0, or --class 0 2 3')
    parser.add_argument('--agnostic-nms', action='store_true', help='class-agnostic NMS')
    parser.add_argument('--augment', action='store_true', help='augmented inference')
    parser.add_argument('--cfg', type=str, default='cfg/yolor_p6.cfg', help='*.cfg path')
    parser.add_argument('--names', type=str, default='server/models/newconn.names', help='*.cfg path')
    opt = parser.parse_args()

    with torch.no_grad():
        detect()


#일단수정본 
