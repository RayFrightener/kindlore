import {Session} from "next-auth";
import {ShowToast} from "./showToast";

export function protectedAction(
    session: Session | null | undefined,
    showToast: ShowToast,
    message = "Please sign in and upload a My Clippings.txt file."
) {
    if (!session) {
        showToast(message);
        return false;
    }
    return true;
}