
import React, { useState } from "react";
import FileTable from "./data/FileTable";
import { edcrHttpRequest, loginRequest } from "./api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";



import './App.css';
export default function FileUploadApp() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [payloadData, setPayloadData] = useState({
    name: "",
    type: "PERMIT",
    subtype: "NEW_APP",
  })
  const [loading, setLoading] = useState(false);
  const [showTabel, setTabel] = useState(false)
  const [tableData, setTableData] = useState([
    {
      name: "Document A",
      type: "PDF",
      subtype: "Report",
      fileUrl: "/files/docA.pdf",
      status: "Open"
    },

  ])
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const validatePayload = (payload) => {
    for (let key in payload) {
      if (
        payload[key] === "" ||
        payload[key] === null ||
        payload[key] === undefined
      ) {
        let field = key
        switch (key) {
          case "name":
            field = "Applicant Name"
            break;
          case "type":
            field = "Application Type"
            break;
          case "subtype":
            field = "Application SubType"
            break;

          default:
            break;
        }
        toast.warn(`${field} is required!`, {
          className: "my-toast-warning",
          position: "bottom-center"
        });

        return false;   // ❌ Validation failed
      }
    }
    return true;        // ✅ Validation passed
  };
  const validateDXF = (file) => {
    if (!file) {
      return false;
    }

    // Check by file extension
    const isDXF = file.name.toLowerCase().endsWith(".dxf");

    if (!isDXF) {

      return false;
    }

    return true;
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    setPayloadData((prev) => {
      const updated = {
        ...prev,
        [name]: value
      };
      if (name === "subtype") {
        if (value === "Layout Approval") {
          updated.type = "LAYOUT_PERMIT";
        } else if (value === "NEW_APP" || value === "NEW_CONSTRUCTION") {
          updated.type = "PERMIT";
        }
      }
      return updated;
    });
  };
  const handleSubmit = async () => {
    // if (!file) return alert("Please select a file first");
    if (!validatePayload(payloadData)) return;
    if (!file) {
      // toast.error("Please select a file first!");
      // return;
      setLoading(false)
      toast.warn("Please select a file first!", {
        className: "my-toast-warning",
        position: "bottom-center",
      });
      return;
    }
    if (validateDXF(file) === false) {
      toast.warn("Only .dxf files are allowed!", {
        className: "my-toast-warning",
        position: "bottom-center",
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", "egovernments");
      formData.append("password", "demo");
      formData.append("grant_type", "password");
      try {
        const response = await loginRequest(
          "egovernments",
          "demo",
          "/edcr/oauth/token?tenantId=state",
        );
        if (response) {
          console.log(response)
          try {
            const response_ = await edcrHttpRequest(
              "post",
              response,
              "/edcr/rest/dcr/scrutinizeplan",
              "scrutinizeplan",
              payloadData,
              file
            );
            if (response_) {
              console.log(response_)

              if (response_ && response_.edcrDetail) {
                const formatted = response_ && response_.edcrDetail.map(item => ({
                  name: item.edcrNumber || "-",
                  type: item.appliactionType || "-",
                  subtype: item.applicationSubType || "-",
                  fileUrl: item.planReport.replace("http://", "https://"),
                  status: item.status
                }));
                setTableData(formatted
                )
                setTabel(true)
                setLoading(false)
              }
              else if (response_ && response_.errorCode) {
                toast.error(response_.errorDetails, {
                  className: "my-toast-error",
                  position: "bottom-center"
                });
                setLoading(false)
                setTabel(false)
              }

            }

          } catch (error) {

            console.log(error)
          }
        }
        // return response;
      } catch (error) {
        console.log(error)
      }


    } catch (error) {
      console.error("Upload failed", error);
    } finally {
    }
  };



  return (

    <div className="flex flex-col items-center gap-4 p-6 min-h-screen bg-gray-100">
      <div class="container">
        <h2>Prototype  Scrutiny</h2>

        <div class="form-group">
          <label for="applicantName">Applicant Name:</label>
          <input type="text" id="name" placeholder="Enter applicant name" required
            name="name"
            value={payloadData.name}
            onChange={handleFieldChange}
          ></input>
        </div>

        <div class="form-group">
          <label for="appliactionType">Application Type</label>
          <input type="text" id="type"
            name="type"
            value={payloadData.type}
            onChange={handleFieldChange}
          ></input>
        </div>

        <div class="form-group">
          <label for="applicationSubType">Application SubType</label>
          <select id="subtype"
            name="subtype"
            value={payloadData.subtype}
            onChange={handleFieldChange} >

            <option value="NEW_CONSTRUCTION">NEW_CONSTRUCTION</option>
            <option value="Layout Approval">Layout Approval</option>
          </select>
        </div>

        <div class="form-group">
          <label for="planFile">Select Plan File (.dxf):</label>
          <input type="file" id="planFile" accept=".dxf"
            onChange={handleFileChange}
            required></input>
        </div>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded bg-blue-600 text-white shadow hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        {/* <button onclick="callApi()">Submit</button> */}
        {/* <button id="downloadJsonBtn" style="display:none;" onclick="downloadJSON()">Download JSON</button> */}

        <div id="resultArea" class="result-card" >
          {
            showTabel && (
              <>
                <h2>File List</h2>
                <FileTable data={tableData} />
              </>
            )
          }

          <ToastContainer position="top-right" autoClose={3000} />
          {/* your routes */}


        </div>
      </div>
    </div>
  );
}

