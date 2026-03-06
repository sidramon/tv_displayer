'use client';

import React from 'react';
import Cropper from 'react-easy-crop';
import { MediaItem } from '@/shared/utils/types/config.types';
import { useMediaUpload } from '../../application/media/useMediaUpload';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface MediaUploaderProps {
    onUploadComplete: (item: MediaItem) => void;
}

export default function MediaUploader({ onUploadComplete }: MediaUploaderProps) {
    const { t, translate } = useTranslation();
    const {
        imageSrc, crop, zoom, isUploading, pendingCount,
        setCrop, setZoom, onCropComplete,
        handleFileChange, handleUploadCrop, handleUploadOriginal,
        handleSkip, handleCancelAll,
    } = useMediaUpload(onUploadComplete);

    if (imageSrc) return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-8">
            <div className="flex justify-between w-full max-w-4xl mb-4 text-white">
                <h3 className="text-xl font-semibold">
                    {t.media.processing} {pendingCount > 0 ? translate('media.pending', { count: String(pendingCount) }) : ''}
                </h3>
                <button onClick={handleCancelAll} className="text-slate-400 hover:text-white transition-colors">
                    {t.media.cancelAll}
                </button>
            </div>

            <div className="relative w-full max-w-4xl h-[60vh] bg-slate-900 rounded-xl overflow-hidden mb-6">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={16 / 9}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
                <button onClick={handleSkip} disabled={isUploading}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors disabled:opacity-50">
                    {t.media.skip}
                </button>
                <button onClick={handleUploadOriginal} disabled={isUploading}
                        className="px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg text-white font-semibold transition-colors disabled:opacity-50">
                    {isUploading ? t.settings.loading : t.media.uploadOriginal}
                </button>
                <button onClick={handleUploadCrop} disabled={isUploading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-colors disabled:opacity-50">
                    {isUploading ? t.settings.loading : t.media.cropAndUpload}
                </button>
            </div>
        </div>
    );

    return (
        <div className="w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <svg className="w-8 h-8 mb-3 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">{t.media.clickToAdd}</span><br />{t.media.dragFiles}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.media.acceptedFormats}</p>
                <input type="file" multiple className="hidden" accept="image/*,video/*" onChange={handleFileChange} disabled={isUploading} />
            </label>

            {isUploading && (
                <div className="mt-4 text-center text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                    {t.media.uploading}
                </div>
            )}
        </div>
    );
}