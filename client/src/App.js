import React, { useState } from "react";
import { CContainer, CRow, CCol } from "@coreui/react";
import axios from "axios";

import "./App.css";

function App() {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Please upload an image that is 5MB or less.");
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const width = img.width;
        const height = img.height;
        const aspectRatio = width / height;

        setFile(file);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFiles([file]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);
    try {
      const res = await axios.post(
        "https://auto.csprojects.live/api/auto/upload",
        formData
      );
      console.log("Image uploaded:", res.data);
      alert("Image uploaded successfully");
      setCaption("");
      setFile(null);
      setErrorMsg(null);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to upload image");
    }
  };

  return (
    <>
      <CContainer style={{ marginTop: "5%" }}>
        <CRow>
          <CCol
            sm={{ cols: "auto", row: "auto" }}
            md={{ cols: "auto", row: "auto" }}
            xs={{ span: true, order: "last" }}
          >
            <div className="container text-center">
              <div className="row">
                <div className="home1">
                  <p className="fs-2 fw-semibold text-start">
                    <span role="img" aria-label="note">
                      🤖Social Media Automation
                    </span>
                  </p>
                </div>

                <p className="fs-5 text-start fw-normal text-break">
                  Social media automation refers to the use of tools and
                  techniques to automate social media tasks and streamline the
                  process of managing social media accounts. These tasks may
                  include posting updates, monitoring engagement, responding to
                  messages, and analyzing performance metrics.
                </p>
                <p className="fs-5 text-start fw-normal text-break">
                  Twitter, Instagram, LinkedIn, and Medium all provide APIs that
                  allow developers to build applications that interact with
                  their platforms. In order to automate social media tasks, a
                  developer would use one or more of these APIs in conjunction
                  with a web application framework such as Express.
                </p>

                <p className="fs-2 fw-semibold text-start">
                  Check The URL's After Uploading
                </p>

                <div>
                  <a
                    style={{ marginRight: "20px" }}
                    href="https://www.instagram.com/metacode.live/"
                  >
                    <img
                      alt="social"
                      src="https://img.icons8.com/3d-fluency/50/null/instagram-new.png"
                    />
                  </a>
                  <a
                    style={{ marginRight: "20px" }}
                    href="https://twitter.com/0xsuhailroushan"
                  >
                    <img
                      alt="social"
                      src="https://img.icons8.com/cute-clipart/50/null/twitter.png"
                    />
                  </a>
                  <a
                    style={{ marginRight: "20px" }}
                    href="https://www.linkedin.com/in/suhailroushan/recent-activity/"
                  >
                    <img
                      alt="social"
                      src="https://img.icons8.com/cute-clipart/50/null/linkedin.png"
                    />
                  </a>
                  <a
                    style={{ marginRight: "20px" }}
                    href="https://suhailroushan.medium.com/"
                  >
                    <img
                      alt="social"
                      src="https://img.icons8.com/sf-black-filled/64/null/medium-logo.png"
                    />
                  </a>
                </div>
              </div>
            </div>
          </CCol>
          <CCol
            sm={{ cols: "auto", row: "auto" }}
            md={{ cols: "auto", row: "auto" }}
            xs={{ span: true, order: "last" }}
          >
            <div className="box">
              <form
                id="image-form"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                <h5>Upload Image Here</h5>
                <div
                  id="drop-area"
                  onDragEnter={(e) => e.preventDefault()}
                  onDragOver={(e) => e.preventDefault()}
                  onDragLeave={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  style={{ height: "80%" }}
                >
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <>
                      <p style={{ marginBottom: "10px" }}></p>
                      <input
                        type="file"
                        id="file-input"
                        name="image"
                        accept="image/jpeg, image/jpg"
                        style={{
                          display: "none",
                        }}
                        onChange={handleFileInputChange}
                      />

                      <p>
                        <label
                          htmlFor="file-input"
                          style={{ cursor: "pointer" }}
                        >
                          Drag and Drop Image Here
                        </label>
                      </p>
                    </>
                  )}
                  {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                </div>
                <div
                  style={{
                    height: "20%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <label htmlFor="caption">Caption:</label>
                  <input
                    type="text"
                    id="caption"
                    name="caption"
                    value={caption}
                    placeholder="Enter caption"
                    onChange={(e) => setCaption(e.target.value)}
                  />
                  <button type="submit" id="submit-btn">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
}

export default App;
