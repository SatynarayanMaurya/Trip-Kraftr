import React from "react";
import { getMailContent } from "../Utils/Messages";

function MailTemplate({ data = {} }) {

    const mail = getMailContent(data);

    return (
        <div>
            <h3>{mail.subject}</h3>

            <p>
                From: {mail.from}
            </p>

            <p>
                To: {mail.to}
            </p>

            <pre className="whitespace-pre-wrap">
                {mail.body}
            </pre>
        </div>
    );
}

export default MailTemplate;