import os

from os import path, makedirs, listdir
import sys
import numpy as np
np.random.seed(1)
import random
random.seed(1)

import torch
from torch import nn
from torch.backends import cudnn
from torch.autograd import Variable

import pandas as pd
from tqdm import tqdm
import timeit
import cv2

from zoo.models import SeNet154_Unet_Loc

from utils import *

cv2.setNumThreads(0)
cv2.ocl.setUseOpenCL(False)

def loc_154(models,img):
    
    with torch.no_grad():
        img = preprocess_inputs(img)
        inp = []
        inp.append(img)
        inp.append(img[::-1, ...])
        inp.append(img[:, ::-1, ...])
        inp.append(img[::-1, ::-1, ...])
        inp = np.asarray(inp, dtype='float')
        inp = torch.from_numpy(inp.transpose((0, 3, 1, 2))).float()
        inp = Variable(inp)

        pred = []
        for model in models:               
            msk = model(inp)
            msk = torch.sigmoid(msk)
            msk = msk.cpu().numpy()
            pred.append(msk[0, ...])
            pred.append(msk[1, :, ::-1, :])
            pred.append(msk[2, :, :, ::-1])
            pred.append(msk[3, :, ::-1, ::-1])
        pred_full = np.asarray(pred).mean(axis=0)
                
        msk = pred_full * 255
        msk = msk.astype('uint8').transpose(1, 2, 0)
        
        # cv2.imwrite(path.join(pred_folder, '{0}.png'.format(f.replace('.png', '_part1.png'))), msk[..., 0], [cv2.IMWRITE_PNG_COMPRESSION, 9])
    return msk
