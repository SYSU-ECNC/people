export const useUserAgent = () => {
  return (
    useRequestHeaders(['user-agent'])['user-agent'] || navigator?.userAgent
  );
};
