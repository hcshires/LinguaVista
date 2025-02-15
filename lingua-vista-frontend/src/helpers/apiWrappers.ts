import axios from "axios";

const BASE_URL = "http://localhost:3010/api";

export const getData = async (url: string, token?: any) => {
    const response = await axios.get(
      `${BASE_URL}${url}`,
      { headers: (token && { Authorization: `Bearer ${token}` }) },
    ).catch((error) => {
      console.log(error);
      if (!error?.response) {
        throw new Error(
            'The server seems to be down :(  Please try again later.',
        );
      }
      throw new Error(`${error.response}, ${error.response.status}`);
    });
  
    return response.data;
  };
  
  
  export const postData = async (url: string, token?: any, payload?: any) => {
    const response = await axios.post(
        `${BASE_URL}${url}`,
        { ...(payload && payload ) },
        { headers: (token && { Authorization: `Bearer ${token}` }) },
    )
        .catch((error) => {
          if (!error?.response) {
            throw new Error(
                'The server seems to be down :(  Try again later.',
            );
          }
          throw new Error(`${error.response}, ${error.response.status}`);
        });
    return response.data;
  };
  
  export const putData = async (url: string, token?: any, payload?: any) => {
      const response = await axios.put(
          `${BASE_URL}${url}`,
        { ...(payload && payload ) },
        { headers: (token && { Authorization: `Bearer ${token}` }) },
      )
          .catch((error) => {
            if (!error?.response) {
              throw new Error(
                  'The server seems to be down :(  Try again later.',
              );
            }
            throw new Error(`${error.response}, ${error.response.status}`);
          });
      return response.data;
  };
    
  export const patchData = async (url: string, token?: any, payload?: any) => {
      const response = await axios.patch(
          `${BASE_URL}${url}`,
          { ...(payload && payload ) },
        { headers: (token && { Authorization: `Bearer ${token}` }) },
      )
          .catch((error) => {
            if (!error?.response) {
              throw new Error(
                  'The server seems to be down :(  Try again later.',
              );
            }
            throw new Error(`${error.response}, ${error.response.status}`);
          });
      return response.data;
    };
    
    export const deleteData = async (url: string, token?: any) => {
      const response = await axios.delete(
          `${BASE_URL}${url}`,
        { headers: (token && { Authorization: `Bearer ${token}` }) },
      ).catch((error) => {
        if (!error?.response) {
          throw new Error(
              'The server seems to be down :(  Try again later.',
          );
        }
        throw new Error(`${error.response}, ${error.response.status}`);
      });
    
      return response.data;
    };
  
    export const getResponseStatus = async (url: string, token?: any) => {
      const response = await axios.get(
        `${BASE_URL}${url}`,
        { headers: (token && { Authorization: `Bearer ${token}` }) },
    ).catch((error) => {
      if (!error?.response) {
        throw new Error(
            'The server seems to be down :(  Please try again later.',
        );
      }
      throw new Error(`${error.response}, ${error.response.status}`);
    });
  
      return {
        status: response.status,
        data: response.data,
      };
    };
    