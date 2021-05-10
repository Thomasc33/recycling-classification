from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from fastai.vision.all import load_learner, PILImage
from pathlib import PurePosixPath
import re
import pathlib
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.PurePosixPath
app = Flask(__name__)
CORS(app)

pattern = re.compile(r'\d{4}_(a\d\d)b\d\dc\d(d\d)(e\d)(f\d)g\dh\d\.jpg')
def get_y(x):
  y =  list(x for x in pattern.search(str(x)).groups())
  return y

# load the learner
learn_wadaba = load_learner('wadaba.pkl')
#classes = learn.data.classes

# define get_y of next model
learn_duck = load_learner('duck.pkl')

def predict_single(img_file, learn):
    'function to take image and return prediction'
    pred, pred_idx, probs = learn.predict(PILImage.create(img_file))
    return {
        'categories': [str(x) for x in pred]#,
        #'probs': {c: round(float(probs[i]), 5) for (i, c) in enumerate(classes)}
    }

# route for prediction
@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    print(request.form, request.args)
    selected_model = request.form.get('model','wadaba')
    if selected_model == 'wadaba':
        return jsonify(predict_single(request.files['image'], learn_wadaba))  
    elif selected_model == 'duckduckgo':
        return jsonify(predict_single(request.files['image'], learn_duck))
    return "model not found", 400

if __name__ == '__main__':
    app.run(host= '192.168.254.76', port=9000, debug=True, ssl_context=('cert.pem', 'key.pem'))