import React, { useEffect, useState } from "react";
import { CgSandClock } from "react-icons/cg";
import { BsPencilFill } from "react-icons/bs";
import { AiFillSave } from "react-icons/ai";
import noImage from "../image/No-Image-Placeholder.svg.webp";
import { Button } from "antd";
import { FaUpload } from "react-icons/fa";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setImageUrl } from "../redux/slices/prescription.slice";
import { SiConvertio } from "react-icons/si";
import {
  fetchResidentById,
  addNewListMedication,
} from "../redux/slices/resident.slice";
import { useParams, useNavigate } from "react-router-dom";
import { convertImageToText } from "../api/ocrApi";
import config from "../utils/config";
import axios from "axios";
export const EditConvertPrescription: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const resident = useSelector(
    (state: RootState) => state.residents.userProfile
  );
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [previewText, setPreviewText] = useState<string>("");
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  const handleAddNewMedicine = async () => {
    const imageProcess = new FormData();
    imageProcess.append("urls", selectedImage);
    imageProcess.append("file", selectedImage);

    // Send image to server
    const data = await axios
      .post(config.API_URL_3RD, imageProcess, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Basic NDA5ZGZmODAtNGZlZi0xMWVlLTk5MmUtNzZhNGZmMTU5NzAzOg==`,
        },
      })
      .then((res: any) => {
        setPreviewText(res.data.results[0].page_data[0].raw_text);
      });
  };
  const handleConvert = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      dispatch(setImageUrl(imageUrl));
      setSelectedImage(imageUrl);
    }
  };
  useEffect(() => {
    id && dispatch(fetchResidentById(+id));
  }, [dispatch, id]);

  return (
    <div className="w-5/6 mx-5">
      <div className="h-[25vh] border rounded-lg border-b-[3px] text-black py-4 w-full">
        <div className="flex py-4 h-full text-sm">
          <img src={noImage} alt="" className="w-[10%] mx-3" />
          <div className="flex w-1/4 items-center">
            <div className=" font-medium text-lg">{resident?.title}</div>
            <CgSandClock className="w-6 h-6" />
          </div>
          <div className="w-1/4 flex flex-col items-start justify-center">
            <div className="text-gray-500">Gender:</div>
            <div className="text-xl font-medium">{resident?.gender}</div>
            <div className="text-gray-500">Day of Birth:</div>
            <div className="text-xl font-medium">{resident?.dayOfBirth}</div>
            <div className="text-gray-500">Room:</div>
            <div className="text-xl font-medium">{resident?.room}</div>
            <div className="text-gray-500">Medicane No:</div>
            <div className="text-xl font-medium">{resident?.medicaneNo}</div>
            <div className="text-gray-500">Chart Expiry Date:</div>
            <div className="text-xl font-medium text-red-500">
              {resident?.expiryDate}
            </div>
          </div>
          <div className="w-1/4 flex flex-col items-start justify-center">
            <div className="text-gray-500">Section:</div>
            <div className="text-xl font-medium">{resident?.section}</div>
            <div className="text-gray-500">RAC ID:</div>
            <div className="text-xl font-medium">{resident?.RACID}</div>
            <div className="text-gray-500">Facility:</div>
            <div className="text-xl font-medium">{resident?.facility}</div>
            <div className="text-gray-500">Doctor:</div>
            <div className="text-xl font-medium">{resident?.doctor}</div>
          </div>
          <div className="flex w-1/4 flex-col justify-center gap-1 items-start">
            <div className="flex gap-3">
              <div className="text-gray-500">Allergies</div>
              <BsPencilFill />
            </div>
            <div className="text-xl text-red-500">Nil Known</div>
            <div className="flex gap-3">
              <div className="text-gray-500">Diagnosis</div>
              <BsPencilFill />
            </div>
            <div className="">a</div>
            <div className="flex gap-3">
              <div className="text-gray-500">Comments</div>
              <BsPencilFill />
            </div>
            <div className="">a</div>
          </div>
        </div>
      </div>
      <div className="flex my-3 gap-10">
        <div className="w-1/2 mx-auto flex flex-col items-start">
          <div className="text-3xl font-semibold">Upload Prescription</div>
          <div className="border w-full my-5"></div>
          {selectedImage ? (
            <div className="w-full">
              display image here
              <img
                src={URL.createObjectURL(selectedImage)}
                alt=""
                className="w-full h-[400px] mx-auto"
              />
            </div>
          ) : (
            <div className="w-full h-[400px] mx-auto">
              <div className="border-dashed border border-slate-500 h-full my-1"></div>
            </div>
          )}
          <div className="flex w-full gap-5 items-center justify-center">
            <label
              htmlFor="fileInput"
              className="w-2/5 gap-2 border-slate-500 border text-slate-500 px-2 py-3 rounded-xl flex justify-center cursor-pointer items-center hover:opacity-90"
            >
              <FaUpload />
              Browse
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="fileInput"
              style={{ display: "none" }}
            />
            <Button
              type="primary"
              onClick={handleAddNewMedicine}
              className="w-2/5 bg-blue-600 text-white rounded-lg flex justify-center py-6 font-bold items-center my-6 text-xl"
            >
              <SiConvertio className="mx-2" onClick={handleConvert} /> Convert
            </Button>
          </div>
        </div>
        <div className="w-1/2">
          <div className="text-3xl font-semibold justify-start flex">
            Preview
          </div>
          <div className="border border-white w-full my-5"></div>
          <textarea
            id="message"
            value={previewText}
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-6 h-[400px]"
            placeholder="Write your thoughts here..."
            defaultValue={""}
          />
          <div className="flex justify-end">
            <Button
              type="primary"
              className="w-1/5 bg-blue-600 text-white rounded-lg flex justify-center py-6 font-bold items-center my-6 text-xl"
            >
              <AiFillSave className="mx-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
