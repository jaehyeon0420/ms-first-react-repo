import { Route, Routes } from "react-router-dom";
import JoinAgree from "./JoinAgree";
import JoinInfo from "./JoinInfo";

export default function JoinMain(){

    return (
        <Routes>
            <Route path="agree" element={<JoinAgree />} />
            <Route path="info" element={<JoinInfo /> } />
        </Routes>
    )
}