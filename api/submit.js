export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "METHOD NOT ALLOWED"
        });
    }

    try {

        const data = req.body;

        if (
            !data.name ||
            !data.dob ||
            !data.mobile ||
            !data.whatsapp ||
            !data.email ||
            !data.state ||
            !data.city ||
            !data.experience ||
            !data.device ||
            !data.working_hours ||
            !data.about
        ) {
            return res.status(400).json({
                success: false,
                message: "PLEASE FILL ALL REQUIRED FIELDS."
            });
        }

        /*
         * SPAM CHECK
         */
        if (data.website) {
            return res.status(400).json({
                success: false,
                message: "INVALID SUBMISSION."
            });
        }

        /*
         * EMAIL CONTENT
         */

        const emailText = `
NEW TRADING EXECUTIVE APPLICATION

--------------------------------
CANDIDATE DETAILS
--------------------------------

FULL NAME:
${data.name}

DATE OF BIRTH:
${data.dob}

MOBILE NUMBER:
${data.mobile}

WHATSAPP NUMBER:
${data.whatsapp}

EMAIL:
${data.email}

STATE:
${data.state}

CITY / DISTRICT:
${data.city}

TRADING EXPERIENCE:
${data.experience}

AVAILABLE DEVICE:
${data.device}

REGULAR HOURS 9:30 AM - 4:00 PM:
${data.working_hours}

ABOUT CANDIDATE:
${data.about}

--------------------------------
APPLICATION RECEIVED
--------------------------------

This application was submitted through the recruitment website.
        `;


        /*
         * RESEND EMAIL API
         */

        const response = await fetch(
            "https://api.resend.com/emails",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.RESEND_API_KEY}`
                },

                body: JSON.stringify({

                    from:
                        process.env.FROM_EMAIL,

                    to: [
                        process.env.TO_EMAIL
                    ],

                    subject:
                        `NEW TRADING EXECUTIVE APPLICATION - ${data.name}`,

                    text:
                        emailText,

                    reply_to:
                        data.email
                })
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            console.error(
                "RESEND ERROR:",
                result
            );

            return res.status(500).json({
                success: false,
                message:
                    "EMAIL SERVICE ERROR."
            });
        }


        /*
         * SUCCESS
         */

        return res.status(200).json({

            success: true,

            message:
                "APPLICATION SUCCESSFULLY SUBMITTED."

        });


    } catch (error) {

        console.error(
            "SERVER ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "SERVER ERROR. PLEASE TRY AGAIN."

        });

    }

}
