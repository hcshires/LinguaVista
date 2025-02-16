import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Typography } from "antd";
import { useLocalStorage } from "../helpers/useLocalStorage";

const { Title, Paragraph } = Typography;

const ConversationContext = createContext<any | null>(null);

const ConversationContextProvider = ({ children }: { children: any }) => {
	const [allConvos, setAllConvos] = useLocalStorage("conversations", []);
	const [currConvo, setCurrConvo] = useState([]);

	const appendConvo = useCallback(() => {
		setAllConvos(allConvos.concat([currConvo]));

		setCurrConvo([]);
	}, [setAllConvos, allConvos, currConvo, setCurrConvo]);

	const convoItems = useCallback(() => {
		return allConvos.map((convo, i) => ({
			key: i,
			label: convo[0].content,
			children: convo.map((c) => (
				<>
					<Title>{c.role}</Title>
					<Paragraph>{c.content}</Paragraph>
				</>
			)),
		}));
	}, [allConvos]);

	console.log(currConvo, allConvos);
	const ConversationContextValue = useMemo(
		() => ({
			allConvos,
			currConvo,
			appendConvo,
			setCurrConvo,
			convoItems,
		}),
		[allConvos, currConvo, appendConvo, setCurrConvo, convoItems]
	);

	return <ConversationContext.Provider value={ConversationContextValue}>{children}</ConversationContext.Provider>;
};

const useConversation = () => useContext(ConversationContext);

export { ConversationContext, ConversationContextProvider, useConversation };
