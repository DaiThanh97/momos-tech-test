import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useAppSelector } from "../../store";
import { StatusCode } from "../../types";

const Notify = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { noti } = useAppSelector((state) => state.noti);

  useEffect(() => {
    const { status, message } = noti;
    if (status !== 0 && message) {
      const variant = [
        StatusCode.SUCCESS,
        StatusCode.CREATED,
        StatusCode.ACCEPTED,
      ].includes(status)
        ? "success"
        : "error";

      enqueueSnackbar(message, { variant });
    }
  }, [noti, enqueueSnackbar]);

  return null;
};

export default Notify;
