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

from zoo.models import SeResNext50_Unet_Double

from utils import *


cv2.setNumThreads(0)
cv2.ocl.setUseOpenCL(False)

def cls_50(models,img,img2):

    with torch.no_grad():
        img = np.concatenate([img, img2], axis=2)
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
            for j in range(2):
                msk = model(inp[j*2:j*2+2])
                msk = torch.softmax(msk[:, :, ...], dim=1)
                msk = msk.cpu().numpy()
                msk[:, 0, ...] = 1 - msk[:, 0, ...]
                
                if j == 0:
                    pred.append(msk[0, ...])
                    pred.append(msk[1, :, ::-1, :])
                else:
                    pred.append(msk[0, :, :, ::-1])
                    pred.append(msk[1, :, ::-1, ::-1])

        pred_full = np.asarray(pred).mean(axis=0) 
        msk = pred_full * 255
        msk = msk.astype('uint8').transpose(1, 2, 0)
        # cv2.imwrite(path.join(pred_folder, '{0}.png'.format(f.replace('.png', '_part1.png'))), msk[..., :3], [cv2.IMWRITE_PNG_COMPRESSION, 9])
        # cv2.imwrite(path.join(pred_folder, '{0}.png'.format(f.replace('.png', '_part2.png'))), msk[..., 2:], [cv2.IMWRITE_PNG_COMPRESSION, 9])
    return msk
