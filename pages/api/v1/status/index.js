// api/v1/status

function status(request, response) {
  response.status(200).json({ status: "tá funcionando" });
}

export default status;
