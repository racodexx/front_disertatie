const image = (name) => {
  return `http://localhost:9000/?image=${name}.jpg`;
};

const handleApiActionResult = (result, toastRef) => {
  if (toastRef) {
    toastRef.current.show({
      severity: result.status,
      summary: result.status.toUpperCase(),
      detail: result.message,
      life: 3000,
    });
  }

  return result.status === "success" ? result.data || true : false;
};
export { image, handleApiActionResult };
