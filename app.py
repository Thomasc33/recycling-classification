from flask import Flask, request, jsonify
from flask_cors import CORS
from fastai.basic_train import load_learner
from fastai.vision import open_image
app = Flask(__name__)
CORS(app, support_credentials=True)

# load the learner
learn = load_learner(path='./models', file='trained_model.pkl')
classes = learn.data.classes


def predict_single(img_file):
    'function to take image and return prediction'
    pred, pred_idx, probs = learn.predict(open_image(img_file))
    return {
        'categories': [str(x) for x in pred],
        'probs': {c: round(float(probs[i]), 5) for (i, c) in enumerate(classes)}
    }


# route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    return jsonify(predict_single(request.files['image']))

if __name__ == '__main__':
    app.run()