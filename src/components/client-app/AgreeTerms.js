import React, { useEffect, useState } from "react";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const AgreeTerms = () => {
  const [hasAccepted, setHasAccepted] = useState(true);
  useEffect(() => {
    setHasAccepted(localStorage.getItem("agreeTerms"));
  }, []);
  const acceptTerms = () => {
    localStorage.setItem("agreeTerms", true);
    setHasAccepted(true);
  };
  const agreeTermsFooter = (
    <React.Fragment>
      <Button onClick={acceptTerms}>Agree terms</Button>
    </React.Fragment>
  );
  return (
    <Dialog
      visible={!hasAccepted}
      style={{ width: "450px" }}
      header="Terms and conditions"
      modal
      footer={agreeTermsFooter}
      onHide={() => {}}
    >
      <div style={{ textIndent: "10px" }}>
        In order to continue, because of the current{" "}
        <strong>GDPR Regulation</strong>, you have to give your consent about
        the fact that the app will use your personal data (name, phone, email,
        address) to complete orders
      </div>
    </Dialog>
  );
};
export default AgreeTerms;
