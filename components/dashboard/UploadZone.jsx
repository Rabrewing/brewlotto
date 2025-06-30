/**
 * Component: UploadZone
 * Description: Drag-and-drop CSV uploader for draw data (admin only)
 * Last updated: 2025-06-25T03:05:00-04:00 (EDT)
 */

import { useState } from 'react';

export default function UploadZone() {
    const [status, setStatus] = useState(null);

    const handleFiles = async (files) => {
        setStatus('Uploading...');
        const form = new FormData();
        for (let file of files) {
            form.append('file', file);
        }

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: form
        });

        if (res.ok) {
            setStatus('✅ Upload complete.');
        } else {
            setStatus('❌ Upload failed. Check console.');
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-500 p-10 rounded-lg text-center text-white mb-10 max-w-3xl mx-auto bg-[#181818]"
        >
            <h2 className="text-lg font-bold mb-2 text-[#FFD700]">📁 Upload Draw CSVs</h2>
            <p className="text-gray-400 mb-2">Drag and drop .csv files here (file name should reflect game)</p>
            {status && <div className="text-green-400 mt-2">{status}</div>}
        </div>
    );
}