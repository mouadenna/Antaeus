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

os.environ["CUDA_VISIBLE_DEVICES"] = ''
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


from zoo.models import Res34_Unet_Double

from utils import preprocess_inputs

cv2.setNumThreads(0)
cv2.ocl.setUseOpenCL(False)

def cls_34(models,img,img2):

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
                msk = torch.sigmoid(msk)
                msk = msk.cpu().numpy()
                
                if j == 0:
                    pred.append(msk[0, ...])
                    pred.append(msk[1, :, ::-1, :])
                else:
                    pred.append(msk[0, :, :, ::-1])
                    pred.append(msk[1, :, ::-1, ::-1])

        pred_full = np.asarray(pred).mean(axis=0)
        
        msk = pred_full * 255
        msk = msk.astype('uint8').transpose(1, 2, 0)
        # cv2.imwrite(path.join(pred_folder, '{0}'.format(f + '_part1.png')), msk[..., :3], [cv2.IMWRITE_PNG_COMPRESSION, 9])
        # cv2.imwrite(path.join(pred_folder, '{0}'.format(f + '_part2.png')), msk[..., 2:], [cv2.IMWRITE_PNG_COMPRESSION, 9])
    return msk
