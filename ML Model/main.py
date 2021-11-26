from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from fastai.vision.all import load_learner, PILImage
from pathlib import PurePosixPath
import re
import pathlib
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.PurePosixPath
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

pattern = re.compile(r'\d{4}_(a\d\d)b\d\dc\d(d\d)(e\d)(f\d)g\dh\d\.jpg')
def get_y(x):
  y =  list(x for x in pattern.search(str(x)).groups())
  return y

# load the learner
learn_wadaba = load_learner('wadaba.pkl')
#classes = learn.data.classes

# define get_y of next model
learn_duck = load_learner('duck.pkl')

learn_wadabaplus = load_learner('wadabaplus.pkl')

def predict_single(img_file, learn):
    'function to take image and return prediction'
    pred, pred_idx, probs = learn.predict(PILImage.create(img_file))
    probabilities = list(probs[pred_idx])
    return {
        'categories': dict(zip([str(x) for x in pred], list(float(x) for x in probs[pred_idx])))
    }
    #return {
    #    'categories': [str(x) for x in pred],
    #    'probs': list(float(x) for x in probs[pred_idx])
    #}

# route for prediction
@app.route('/predict', methods=['POST'])
@cross_origin(origin='*')
def predict():
    selected_model = request.form.get('model','wadaba')
    if selected_model == 'wadaba':
        return jsonify(predict_single(request.files['image'], learn_wadaba))  
    if selected_model == 'wadabaplus':
        return jsonify(predict_single(request.files['image'], learn_wadabaplus))  
    elif selected_model == 'duckduckgo':
        return jsonify(predict_single(request.files['image'], learn_duck))
    return "model not found", 400

@app.route('/')
def home():
    return 'OK', 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)