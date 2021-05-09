from flask import Flask, request, jsonify
from flask_cors import CORS
from fastai.vision.all import load_learner, PILImage
from pathlib import PurePosixPath
import re
import pathlib
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath
app = Flask(__name__)
CORS(app, support_credentials=True)

pattern = re.compile(r'\d{4}_(a\d\d)b\d\dc\d(d\d)(e\d)(f\d)g\dh\d\.jpg')
def get_y(x):
  y =  list(x for x in pattern.search(str(x)).groups())
  return y

# load the learner
learn = load_learner('trained_model.pkl')
#classes = learn.data.classes

def predict_single(img_file):
    'function to take image and return prediction'
    pred, pred_idx, probs = learn.predict(PILImage.create(img_file))
    return {
        'categories': [str(x) for x in pred]#,
        #'probs': {c: round(float(probs[i]), 5) for (i, c) in enumerate(classes)}
    }

# route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    return jsonify(predict_single(request.files['image']))

if __name__ == '__main__':
    app.run()