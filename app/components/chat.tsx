import { CONSTANTS } from "@pushprotocol/restapi";
import { ChatUIProvider, ChatView, darkChatTheme } from "@pushprotocol/uiweb";
import styled from "styled-components";

interface Props {
  CHAT_ID: any;
}

const ChatWrapper: React.FC<Props> = ({ CHAT_ID }) => {
  return (
    <ChatWrapperContainer>
      <ChatUIProvider theme={darkChatTheme} env={CONSTANTS.ENV.STAGING}>
        <ChatView chatId={CHAT_ID} limit={10} autoConnect={true} />
      </ChatUIProvider>
    </ChatWrapperContainer>
  );
};

export default ChatWrapper;

const ChatWrapperContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
