import os
os.environ["MKL_NUM_THREADS"] = "1" 
os.environ["NUMEXPR_NUM_THREADS"] = "1" 
os.environ["OMP_NUM_THREADS"] = "1"
from os import path, makedirs
import sys
import numpy as np
np.random.seed(1)
import random
random.seed(1)
import torch
torch.set_num_threads(1)
from torch import nn
from torch.autograd import Variable
import timeit
import cv2
from zoo.models import Res34_Unet_Loc

from utils import preprocess_inputs

import os
import timeit
import numpy as np
import torch
from torch.autograd import Variable
import cv2

def process_image_with_models(models, img):
    t0 = timeit.default_timer()
    # Preprocess the input image
    img = preprocess_inputs(img)

    # Prepare input variations for the models
    inp = []
    inp.append(img)
    inp.append(img[::-1, ...])
    inp.append(img[:, ::-1, ...])
    inp.append(img[::-1, ::-1, ...])
    inp = np.asarray(inp, dtype='float')
    inp = torch.from_numpy(inp.transpose((0, 3, 1, 2))).float()
    inp = Variable(inp)

    pred = []

    # Perform prediction with each model
    with torch.no_grad():
        for model in models:
            for j in range(2):
                msk = model(inp[j * 2:j * 2 + 2])
                msk = torch.sigmoid(msk)
                msk = msk.cpu().numpy()

                if j == 0:
                    pred.append(msk[0, ...])
                    pred.append(msk[1, :, ::-1, :])
                else:
                    pred.append(msk[0, :, :, ::-1])
                    pred.append(msk[1, :, ::-1, ::-1])

    # Aggregate predictions
    pred_full = np.asarray(pred).mean(axis=0)
    msk = pred_full * 255
    msk = msk.astype('uint8').transpose(1, 2, 0)

    
    # Return the processed image (mask) instead of saving it
    return msk
