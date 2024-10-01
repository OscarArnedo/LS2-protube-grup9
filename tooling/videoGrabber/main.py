#! /usr/bin/env python

import os
import subprocess
import json
import random
import sys
from enum import Enum
import getopt

from vars import YT_DLP_BIN, FFMPEG_BIN, FFPROBE_BIN

STORE_DIR = ''
VIDEOS_FILE = ''

def compute_cut_params(v: str, full_duration: int) -> dict[str, int]:
    class Percentile(Enum):
        BASELINE = 0
        AVERAGE = 1
        LONG = 2
        XL = 3
        XXL = 4

    durations_map = {
        Percentile.BASELINE: 20,
        Percentile.AVERAGE: 30,
        Percentile.LONG: 40,
        Percentile.XL: 65,
        Percentile.XXL: 80
    }

    duration_input = random.randint(0, 100)
    if duration_input < 80:
        percentile = (Percentile.BASELINE, Percentile.AVERAGE)
    elif duration_input < 90:
        percentile = (Percentile.AVERAGE, Percentile.LONG)
    else:
        percentile = (Percentile.XL, Percentile.XXL)

    duration = full_duration if durations_map[percentile[1]] > full_duration else random.randint(durations_map[percentile[0]], durations_map[percentile[1]])
    start_attempt = 41 if v == "dQw4w9WgXcQ" else random.randint(35, 45)
    start = start_attempt if start_attempt + duration <= full_duration else 0

    return {
        "start": start,
        "duration": duration
    }

def grab_video(v:str, id: int):
    YT_URL = "https://www.youtube.com/watch"
    CONSTANT_DLP_PARAMS = ("--quiet --no-overwrites --write-comments --extractor-args youtube:max_comments={} "
                           "--remux-video mp4 --write-info-json --write-thumbnail --convert-thumbnails webp --embed-thumbnail"
                           .format(random.randint(1, 14)))

    dlp_command = f"{YT_DLP_BIN} -f bv+ba -S filesize~100M -o {id}_tmp.%(ext)s {CONSTANT_DLP_PARAMS} {YT_URL}?v={v}"

    subprocess.run(dlp_command.split(" "), cwd=STORE_DIR)

    os.renames(f"{STORE_DIR}/{id}_tmp.webp", f"{STORE_DIR}/{id}.webp")

    video_info_filename = f"{STORE_DIR}/{id}_tmp.info.json"

    with open(video_info_filename) as f:
        j = json.load(f)
        title = j["title"]
        categories = j["categories"]
        tags = j["tags"]
        full_duration = j["duration"]
        comments = [ {"text": comment["text"], "author": comment["author"][1:]} for comment in j["comments"] ] if "comments" in j else []

    os.remove(video_info_filename)

    cut_params = compute_cut_params(v, full_duration)

    ffmpeg_cut_command = (f"{FFMPEG_BIN} -y -v error -ss {cut_params['start']} -t {cut_params['duration']} -i {id}_tmp.mp4 -c copy"
                          f" -avoid_negative_ts make_zero {id}.mp4")
    subprocess.run(ffmpeg_cut_command.split(" "),
                   cwd=STORE_DIR)

    os.remove(f"{STORE_DIR}/{id}_tmp.mp4")

    # get format of downloaded video
    ffprobe_command = f"{FFPROBE_BIN} -v error -select_streams v:0 -show_entries stream=width,height -of json {id}.mp4"
    result = subprocess.run(ffprobe_command.split(" "),
                            capture_output=True,
                            text=True,
                            cwd=STORE_DIR)
    json_video_info = json.loads(result.stdout)
    video_format_info = json_video_info["streams"][0]

    info = {
        "id": id,
        "width": video_format_info["width"],
        "height": video_format_info["height"],
        "duration": round(float(cut_params["duration"]), 2),
        "title": title,
        "user": j["channel"],
        "meta": {
            "description": j["description"],
            "categories": categories,
            "tags": tags,
            "comments": comments
        }
    }

    with open(f"{STORE_DIR}/{id}.json", 'w', encoding='utf-8') as o:
        json.dump(info, o)


def get_videos():
    file = VIDEOS_FILE

    with open(file) as f:
        videos = f.readlines()

        sanitized_videos = [line.strip() for line in videos if len(line.strip()) > 0 and not line.startswith("--")]
        return [video for video in sanitized_videos if random.randint(0, 100) < 75]


def grab_videos():
    videos = get_videos()
    video_count = len(videos)

    for video, id in zip(videos, range(video_count)):
        progress = int((float(id) / video_count) * 100)
        print(f"Grabbing your videos... {progress}%", end='\r')
        sys.stdout.flush()
        grab_video(video, id)

    print(f"Grabbing your videos... done")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise Exception("Id cannot be empty!")

    opts, args = getopt.getopt(sys.argv[1:], 'hi:v:s:r', ['help', 'id=', 'videos=', 'store=', 'recreate'])

    id = None
    recreate = False

    for opt, arg in opts:
        if opt in ('-h', '--help'):
            print('Usage: main.py --id <group_id> --store <output_directory> [--recreate]')
            sys.exit()
        elif opt in ('-i', '--id'):
            id = int(arg)
        elif opt in ('-v', '--videos'):
            VIDEOS_FILE = arg
        elif opt in ('-s', '--store'):
            STORE_DIR = arg
        elif opt in ('-r', '--recreate'):
            recreate = True


    if id is None:
        print('Error: group_id not set')
        sys.exit(-1)
    elif STORE_DIR == '':
        print('Error: store directory not set')
        sys.exit(-1)

    print(f'Saving data to: {STORE_DIR}')
    if recreate:
        print('Info: recreate mode set. This will re-download all your data')

    if not os.path.isfile(VIDEOS_FILE):
        print('Video list not set or incorrect')
        sys.exit(-1)

    if not os.path.exists(STORE_DIR):
        os.mkdir(STORE_DIR)
    else:
        if not os.path.isdir(STORE_DIR):
            print('Error: store parameter is not a directory')
            sys.exit(-1)

        # exists and isdir. Check what to do
        if not recreate:
            print('Error: store directory already exists. Exiting. To override, rerun with --recreate')
            sys.exit(0)

        # So you have chosen... death
        [os.remove(f"{STORE_DIR}/{f}") for f in os.listdir(STORE_DIR)]

    random.seed(id)
    grab_videos()
