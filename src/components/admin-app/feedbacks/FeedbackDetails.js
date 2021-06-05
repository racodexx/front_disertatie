import React, { useState } from "react";
import styled from "styled-components";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import CustomTextArea from "../../base/CustomTextArea";
import FeedbackStatus from "../../../utils/enums/FeedbackStatus";
import { sendReply, deleteFeedback } from "../../../services/feedbackService";
import { handleApiActionResult } from "../../../utils/util";

const DialogContent = styled.div`
  .feedback-message {
    color: black;
  }
`;

const RemoveButton = styled.i`
  color: red;
  font-size: 25px;
  cursor: pointer;
`;

const FeedbackDetails = ({ feedback, onHide, toastRef }) => {
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [failedSendMailAttempt, setFailedSendMailattempt] = useState(false);

  const onReplyMessageChange = (value) => {
    setReplyMessage(value);
    failedSendMailAttempt && setFailedSendMailattempt(false);
  };

  const sendMail = async () => {
    if (replyMessage.length === 0) {
      setFailedSendMailattempt(true);
      return;
    }
    let response = await sendReply(feedback, replyMessage);
    const success = handleApiActionResult(response, toastRef);
    if (success) {
      onHide({ statusId: FeedbackStatus.Replied, reply: replyMessage });
    }
  };

  const removeFeedback = async () => {
    let response = await deleteFeedback(feedback._id);
    const success = handleApiActionResult(response, toastRef);
    if (success) {
      onHide({ statusId: FeedbackStatus.Deleted });
    }
  };

  const resetStates = () => {
    setReplyMessage("");
    setIsReplying(false);
    setFailedSendMailattempt(false);
  };

  const onHideActions = () => {
    resetStates();
    onHide(
      feedback?.statusId === FeedbackStatus.Unread
        ? { statusId: FeedbackStatus.Read }
        : null
    );
  };

  const getDialogFooter = () => {
    if (feedback?.statusId === FeedbackStatus.Replied) {
      return (
        <RemoveButton
          className="pi pi-trash"
          onClick={removeFeedback}
        ></RemoveButton>
      );
    }
    if (!isReplying) {
      return (
        <Button
          onClick={() => {
            setIsReplying(true);
          }}
        >
          Reply
        </Button>
      );
    }
    if (isReplying) {
      return (
        <Button
          onClick={() => {
            sendMail();
          }}
        >
          Send mail
        </Button>
      );
    }
  };

  const dialogFooter = getDialogFooter();

  return (
    <>
      {feedback !== null ? (
        <Dialog
          visible={feedback !== null}
          style={{ width: "450px" }}
          header={"Feedback"}
          modal
          footer={dialogFooter}
          onHide={onHideActions}
        >
          <DialogContent>
            <div className="p-grid">
              <label className="p-col-2">Id</label>
              <div className="p-col-10">
                <span>{feedback._id}</span>
              </div>
            </div>
            <div className="p-grid">
              <label className="p-col-2">From</label>
              <div className="p-col-10">
                <span>{feedback.name}</span>
              </div>
            </div>
            <div className="p-grid">
              <label className="p-col-2">Phone</label>
              <div className="p-col-10">
                <span>{feedback.phone}</span>
              </div>
            </div>
            <div className="p-grid">
              <label className="p-col-2">Email</label>
              <div className="p-col-10">
                <span>{feedback.email}</span>
              </div>
            </div>
            <CustomTextArea
              id="message"
              label="Customer message"
              value={feedback.message}
              width="100%"
              disabled={true}
            />

            {(isReplying || feedback?.reply) && (
              <CustomTextArea
                id="reply"
                label="Reply message"
                value={feedback?.reply || replyMessage}
                onChange={(value) => {
                  onReplyMessageChange(value);
                }}
                width="100%"
                required
                errorMessage={
                  failedSendMailAttempt
                    ? "The message of the mail cannot be empty"
                    : ""
                }
                disabled={feedback?.reply}
              />
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <></>
      )}
    </>
  );
};
export default FeedbackDetails;
