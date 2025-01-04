import {createContext, useContext, useRef, useState} from 'react';
import OpenAI from 'openai';

const APIKeys = require('@/assets/API_keys.json');
const client = new OpenAI({
  baseURL: 'https://api.deepseek.com/beta',
  apiKey: `${APIKeys.deepseek}`,
});

export const DocsInputContext = createContext({});
export const DocsInputProvider = ({children}) => {
  const debounce = (func, delay) => {
    if (typeof func !== "function") {
      console.log(func, delay);
      throw new Error("Provided argument is not a function");
    }
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {func(...args);}, delay);
    };
  };
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const fetchSuggestions = async (text) => {
    if (text.length < 3) {
      setSuggestions([]);  // 输入少于3个字符时，不显示建议
      return;
    }

    try {
      // const response = await openai.chat.completions.create({
      //   messages: [{ role: "system", content: "You are a helpful assistant." }],
      //   model: "deepseek-chat",
      // });
      // console.log(response.choices[0].message.content);
      const response = await client.completions.create({
        model: 'deepseek-chat',
        prompt: text,
        max_tokens: 10,
      });
      console.log(response.choices[0].text);
      // const data = await response.json();
      const suggestions = response.choices.map(choice => choice.text.trim());
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };
  const debouncedFetchSuggestions = useRef(debounce(fetchSuggestions, 500)).current;
  const handleInputChange = (text) => {
    setInputText(text);

    // 向 LLM 发起请求获取自动补全建议
    // fetchSuggestions(text);
    debouncedFetchSuggestions(text);
  };
  const handleSuggestionSelect = (suggestion) => {
    setInputText(inputText + suggestion);
    setSuggestions([]);  // 清空建议列表
  };
  const docsInputContext = {
    inputText,
    handleInputChange,
    suggestions,
    handleSuggestionSelect,
  };
  return (
    <DocsInputContext.Provider value={docsInputContext}>
      {children}
    </DocsInputContext.Provider>
  );
};

const useDocsInputContext = () => {
  const contextValue = useContext(DocsInputContext);
  return contextValue;
};
export { useDocsInputContext };
