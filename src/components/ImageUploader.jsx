import { UploadIcon } from "../assets/icons/Icons";

const ImageUploader = ({ selectedImage, onChange }) => (
  <div>
    <h2 className="text-2xl font-bold mb-3 border-b-2 border-blue-500 pb-2">
      1. Upload Your Photo
    </h2>
    <label
      htmlFor="file-upload"
      className="cursor-pointer"
      aria-label="Upload image">
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-500 hover:border-blue-400 transition-all px-6 py-10">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Uploaded preview"
            className="max-h-64 rounded-lg object-contain"
          />
        ) : (
          <div className="text-center">
            <UploadIcon />
            <div className="mt-4 flex text-sm leading-6 text-gray-400">
              <p className="pl-1">Choose a file or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-500">
              PNG, JPG, GIF (up to 10MB)
            </p>
          </div>
        )}
      </div>
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        className="sr-only"
        accept="image/*"
        onChange={onChange}
      />
    </label>
  </div>
);

export default ImageUploader;
