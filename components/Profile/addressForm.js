import LoadingButton from "../Ui/Button";
import countryData from "~/data";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { formField, postData } from "~/lib/clientFunctions";
import { toast } from "react-toastify";

export default function NewCustomer() {
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();
  async function handleInfo(e) {
    try {
      e.preventDefault();
      setButtonState("loading");
      const data = formField(e.target.elements);
      const resp = await postData("/api/profile/address", data);
      resp.success
        ? (toast.success("Customer Added Successfully"), e.target.reset())
        : toast.error("Something Went Wrong");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    setButtonState("");
  }
  return (
    <form onSubmit={handleInfo}>
      <div className="mb-3">
        <label className="mb-3">{t("add_address")}</label>
        <div className="mb-3">
          <input
            type="text"
            placeholder={`${t("full_name")}*`}
            name="name"
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="tel"
            placeholder={`${t("phone")}*`}
            name="phone"
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder={`${t("house_street")}*`}
            name="house"
            required
            rows="2"
          />
        </div>
      </div>
      <LoadingButton text={t("submit")} type="submit" state={buttonState} />
    </form>
  );
}
