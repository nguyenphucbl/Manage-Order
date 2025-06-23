import { getTableLink } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export default function CreateQrCode({
  token,
  tableNumber,
  width = 200,
}: {
  token: string;
  tableNumber: number;
  width?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.height = width + 70;
    canvas.width = width;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#ffffff"; // Set background color to white
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "16px Arial";
    context.textAlign = "center";
    context.fillStyle = "#000000"; // Set text color to black
    context.fillText(`Bàn số ${tableNumber}`, canvas.width / 2, 20);
    context.fillText("Quét mã QR để gọi món", canvas.width / 2, 40);
    const virtualCanvas = document.createElement("canvas");
    QRCode.toCanvas(
      virtualCanvas,
      getTableLink({
        token,
        tableNumber,
      }),
      (error) => {
        if (error) {
          return console.error("Error generating QR code:", error);
        }
        context.drawImage(
          virtualCanvas,
          0,
          60,
          width,
          width // Draw the QR code below the text
        );
      }
    );
  }, [token, tableNumber, width]);

  return <canvas ref={canvasRef}></canvas>;
}
