import React, { useRef, useEffect } from 'react';
import Quagga from 'quagga';

function BarcodeScanner() {
    const videoRef = useRef(null);

    useEffect(() => {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: videoRef.current,
                constraints: {
                    width: 640,
                    height: 480,
                    facingMode: "environment"
                },
            },
            decoder: {
                readers: ["code_128_reader"]
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            }
        }, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            Quagga.start();
        });

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((err) => {
                console.log(err);
            });

        Quagga.onDetected((result) => {
            console.log(result.codeResult.code);
        });

        return () => {
            Quagga.stop();
        };
    }, []);

    return (
        <div>
            <video ref={videoRef} autoPlay={true} />
        </div>
    );
}

export default BarcodeScanner;
