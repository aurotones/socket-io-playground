import moment from "moment";

export default function formatTime(time: number){
    return moment(time).format("YYYY/MM/DD HH:mm:ss")
}
