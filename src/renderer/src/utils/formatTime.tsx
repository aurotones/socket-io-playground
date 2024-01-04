import moment from "moment";

export default function formatTime(time: number){
    let fullTime = moment(time).format("YYYY/MM/DD HH:mm:ss.SSS");
    return (
        <span title={fullTime}>
            { moment(time).format("HH:mm:ss.SSS") }
        </span>
    )
}
