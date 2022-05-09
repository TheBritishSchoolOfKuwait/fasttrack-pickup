import axios from "axios";
import { response } from "express";

const pickup = async (req, res) => {
    const { adno, staffCde, gate } = req.query
    const url =
        decodeURI(`http://bie-api.bsk.edu.kw:4950/Service.asmx/StudentPickupWalking?adNo=${adno}&gate=${gate}&staffCode=${staffCde}`);

    await axios.get(url).then(response => {
        if (response.status === 200) {
            return res.status(200).json({
                status: "Success",
                message: response.data
            });
        }
    }).catch(error => {
        console.log(`Error: ${error}`)
        return res.status(200).json({
            status: "Failure",
            message: "Incorrect AdNo"
        })
    })

}
export default pickup