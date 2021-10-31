import {useState, useEffect, useRef} from 'react'
import { Form, Button, Message, Segment, Divider } from "semantic-ui-react";
import { HeaderMessage, FooterMessage} from '../components/Common/WelcomeMessage'
import CommonInputs from "../components/Common/CommonInputs";
import ImageDropDiv from "../components/Common/ImageDropDiv";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { registerUser } from "../utils/authUser";
import uploadPic from "../utils/uploadPicToCloudinary";

let cancel;

// Regular Expression for removing Special Characters
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

const Register = () => {

    // User State
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        facebook: "",
        youtube: "",
        twitter: "",
        instagram: ""
    });
    // Destructuring User Values
    const { name, email, password, bio } = user;

    // Show Social links, because social links are optional
    const [showSocialLinks, setShowSocialLinks] = useState(false);
    // For Password Visibility
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    // state for UserName
    const [username, setUsername] = useState("");
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(false);
    // State for Media
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [highlighted, setHighlighted] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        // check if these fields have values or not, if values means enable submit button
        const isUser = Object.values({ name, email, password, bio }).every(item =>
          Boolean(item)
        );
        isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
    },[user]);

    const checkUserName = async() => {
        setUsernameLoading(true);
        try {
            cancel && cancel();
      
            const CancelToken = axios.CancelToken;
      
            const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
              cancelToken: new CancelToken(canceler => {
                cancel = canceler;
              })
            });
      
            if (errorMsg !== null) setErrorMsg(null);
      
            if (res.data === "Available") {
              setUsernameAvailable(true);
              setUser(prev => ({ ...prev, username }));
            }
        } catch (error) {
            setErrorMsg("Username Not Available");
            setUsernameAvailable(false);
        }
        setUsernameLoading(false);
    }

    // check the userName is available or not in DB
    useEffect(() => {
        username === "" ? setUsernameAvailable(false) : checkUserName();
    }, [username]);

    const handleChange = event => {
        // Destructuring events
        const { name, value, files } = event.target;
        if(name === "media") {
            setMedia(files[0]);
            setMediaPreview(URL.createObjectURL(files[0]));
        }
        setUser({...user, [name]: value});
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        setFormLoading(true);
        let profilePicUrl;

        if (media !== null) {
            // send to cloudinary api
            profilePicUrl = await uploadPic(media);
        }

        if (media !== null && !profilePicUrl) {
            setFormLoading(false);
            return setErrorMsg("Error Uploading Image");
        }
        // send to regsiterUser Api
        await registerUser(user, profilePicUrl, setErrorMsg, setFormLoading);
    }

    return (
        <>
            <HeaderMessage />
            <Form 
                loading={formLoading} 
                error={errorMsg !== null}
                onSubmit={handleSubmit}
            >
                <Message 
                    error
                    header={"Oops!"}
                    content={errorMsg}
                    onDismiss={() => setErrorMsg(null)}
                />
                <Segment>

                    <ImageDropDiv
                        mediaPreview={mediaPreview}
                        setMediaPreview={setMediaPreview}
                        setMedia={setMedia}
                        inputRef={inputRef}
                        highlighted={highlighted}
                        setHighlighted={setHighlighted}
                        handleChange={handleChange}
                    />

                    <Form.Input
                        required
                        label="Name"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        fluid
                        icon="user"
                        iconPosition="left"
                    />

                    <Form.Input
                        required
                        label="Email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        fluid
                        icon="envelope"
                        iconPosition="left"
                        type="email"
                    />

                    <Form.Input
                        label="Password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        fluid
                        icon={{
                            name: "eye",
                            circular: true,
                            link: true,
                            onClick: () => setShowPassword(!showPassword)
                        }}
                        iconPosition="left"
                        type={showPassword ? "text" : "password"}
                        required
                    />

                    <Form.Input
                        loading={usernameLoading}
                        error={!usernameAvailable}
                        required
                        label="Username"
                        placeholder="Username"
                        value={username}
                        onChange={e => {
                            setUsername(e.target.value);
                            if (regexUserName.test(e.target.value)) {
                                setUsernameAvailable(true);
                            } else {
                                setUsernameAvailable(false);
                            }
                        }}
                        fluid
                        icon={usernameAvailable ? "check" : "close"}
                        iconPosition="left"
                    />

                    <CommonInputs 
                        user={user}
                        showSocialLinks={showSocialLinks}
                        setShowSocialLinks={setShowSocialLinks}
                        handleChange={handleChange}
                    />

                    <Button
                        icon="signup"
                        content="Signup"
                        type="submit"
                        color="orange"
                        disabled={submitDisabled || !usernameAvailable}
                    />

                </Segment>
            </Form>
            <FooterMessage />
        </>
    )
}

export default Register
