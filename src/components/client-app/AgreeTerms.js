import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const MoreDetails = styled.div`
  cursor: pointer;
  color: #0082ff;
`;

const StyledDialog = styled(Dialog)`
  .p-dialog-footer {
    padding: 15px;
  }
`;

const AgreeTerms = () => {
  const [hasAccepted, setHasAccepted] = useState(true);
  const [displayMore, setDisplatMore] = useState(false);
  useEffect(() => {
    setHasAccepted(localStorage.getItem("agreeTerms"));
  }, []);
  const acceptTerms = () => {
    localStorage.setItem("agreeTerms", true);
    setHasAccepted(true);
  };
  const agreeTermsFooter = (
    <>
      <Button onClick={acceptTerms}>Agree terms</Button>
    </>
  );
  return (
    <StyledDialog
      visible={!hasAccepted}
      style={{ width: "450px", maxHeight: "80%" }}
      header="Terms and conditions"
      modal
      footer={agreeTermsFooter}
      closable={false}
      onHide={() => {}}
    >
      <div style={{ textIndent: "10px" }}>
        In order to continue, because of the current{" "}
        <strong>GDPR Regulation</strong>, you have to give your consent about
        the fact that the app will use your personal data (name, phone, email,
        address) to complete orders
      </div>
      <MoreDetails
        onClick={() => {
          setDisplatMore(!displayMore);
        }}
      >
        {displayMore ? "show less" : "show more"}
      </MoreDetails>
      {displayMore && (
        <div>
          <p>
            In order for your visit to OldMill to be attractive and to allow
            some features to be used, we use so-called cookies on various pages.
            Cookies are small text files that are stored in your browser. Some
            of the cookies we use are deleted after the end of your browser
            session, i.e. after you close the browser. Other cookies remain in
            your browser and allow us to recognize your browser on your next
            visit (permanent cookies). You can configure your browser to know
            how to set cookies and decide individually whether or not to accept
            them for specific occasions or in general. Not accepting cookies may
            limit the functionality of our site.
          </p>

          <p>We classify the cookies we use into three categories:</p>
          <ul>
            <li>Required</li>
            <li>Functional</li>
            <li>Personalization</li>
          </ul>

          <p>
            Below you will find more information about your choices as well as a
            detailed list of cookies we use.
          </p>

          <p>
            The required cookies are necessary to navigate our site and use its
            features. Without the use of these cookies, the proper functioning
            of our site is not guaranteed (e.g. text input) when browsing the
            pages of the website. In addition, they are cookies that collect
            information about how visitors use our site, for example, which
            pages they visit more often and if they receive error messages. They
            also allow our site to remember your choices, such as language or
            area, to provide improved features. They are also used to store
            information about the consent option where required. No action is
            required from you to activate them.
          </p>

          <p>
            Functional cookies allow us to continuously improve the services we
            offer, collecting and analyzing information about our website
            traffic.
          </p>
          <p>
            They can also be used to send ads and bids or to measure the
            effectiveness of our ad campaigns. So they give us the opportunity
            to suggest and help you find what you are looking for. This category
            also include cookies from third parties.
          </p>

          <p>
            Personalization cookies are used to create tailor-made content for
            you to give you the best possible OldMill experience.
          </p>

          <h3>Objection to the use of cookies</h3>
          <p>
            If you do not want us to collect and analyze information about your
            visit, you can opt-out at any time for the future.
          </p>

          <p>
            For the technical implementation, an exception cookie will be set in
            your browser. This cookie is solely intended to map your objection.
            Please note that for technical reasons the opt-out cookie can only
            be used for the specific browser from which it is set. If you delete
            cookies or use a different browser or device, you will need to
            repeat this process.
          </p>

          <h4>What are cookies</h4>
          <p>
            Cookies are small text files that are stored in your browser. See
            the categories of cookies below and adjust your choices.
          </p>
        </div>
      )}
    </StyledDialog>
  );
};
export default AgreeTerms;
