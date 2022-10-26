import { Response } from 'express';
import { ApiSuccess, getSuccessResponse } from '@/utils';
import { toApiModel } from '@helpers/api-model';
import { service } from '@services/index';
import { TypedRequest, validation } from '@validations/index';

const getServerDetail = async (
  req: TypedRequest<typeof validation.servers.detail>,
  res: Response
) => {
  const { serverId } = req.params;
  const data = await service.servers.findById(req.authUser, { id: serverId });
  const success = ApiSuccess.ok({ data: toApiModel.servers([data]) });
  return res.status(success.statusCode).json(getSuccessResponse(success));
};

const getServerList = async (
  req: TypedRequest<typeof validation.servers.list>,
  res: Response
) => {
  const data = await service.servers.findMany(req.authUser);
  const success = ApiSuccess.ok({ data: toApiModel.servers(data) });
  return res.status(success.statusCode).json(getSuccessResponse(success));
};

const deleteServer = async (
  req: TypedRequest<typeof validation.servers.deleteServer>,
  res: Response
) => {
  const { serverId } = req.params;
  await service.servers.deleteById({ id: serverId });
  const success = ApiSuccess.noContent({ data: null });
  return res.status(success.statusCode).json(getSuccessResponse(success));
};

const createServer = async (
  req: TypedRequest<typeof validation.servers.create>,
  res: Response
) => {
  const remoteServerLoginRes = await service.servers.remoteServerLogin(
    req.body
  );

  const data = await service.servers.create({
    name: req.body.name,
    ...remoteServerLoginRes,
  });

  const success = ApiSuccess.ok({ data: toApiModel.servers([data])[0] });
  return res.status(success.statusCode).json(getSuccessResponse(success));
};

const updateServer = async (
  req: TypedRequest<typeof validation.servers.update>,
  res: Response
) => {
  const { serverId } = req.params;
  const { username, password, name, legacy, type, url } = req.body;

  if (type && username && password && url) {
    const remoteServerLoginRes = await service.servers.remoteServerLogin({
      legacy,
      password,
      type,
      url,
      username,
    });

    const data = await service.servers.update(
      { id: serverId },
      { name, ...remoteServerLoginRes }
    );

    const success = ApiSuccess.ok({ data: toApiModel.servers([data])[0] });
    return res.status(success.statusCode).json(getSuccessResponse(success));
  }

  const data = await service.servers.update({ id: serverId }, { name, url });
  const success = ApiSuccess.ok({ data: toApiModel.servers([data])[0] });
  return res.status(success.statusCode).json(getSuccessResponse(success));
};

const refreshServer = async (
  req: TypedRequest<typeof validation.servers.refresh>,
  res: Response
) => {
  const { serverId } = req.params;
  const data = await service.servers.refresh({ id: serverId });

  const success = ApiSuccess.ok({ data: toApiModel.servers([data])[0] });
  return res.status(success.statusCode).json(getSuccessResponse(success));
};

const scanServer = async (
  req: TypedRequest<typeof validation.servers.scan>,
  res: Response
) => {
  const { serverId } = req.params;
  const { serverFolderId } = req.body;

  const data = await service.servers.fullScan({
    id: serverId,
    serverFolderId,
  });

  const success = ApiSuccess.ok({ data });
  return res.status(success.statusCode).json(getSuccessResponse(success));
};

const createServerUrl = async (
  req: TypedRequest<typeof validation.servers.createUrl>,
  res: Response
) => {
  const { serverId } = req.params;
  const { url } = req.body;

  const data = await service.servers.createUrl({
    serverId,
    url,
  });

  const success = ApiSuccess.ok({ data });
  return res.status(success.statusCode).json(getSuccessResponse(success));
};

const deleteServerUrl = async (
  req: TypedRequest<typeof validation.servers.deleteUrl>,
  res: Response
) => {
  const { urlId } = req.params;

  await service.servers.deleteUrlById({
    id: urlId,
  });

  const success = ApiSuccess.noContent({ data: null });
  return res.status(success.statusCode).json(getSuccessResponse(success));
};

const enableServerUrl = async (
  req: TypedRequest<typeof validation.servers.enableUrl>,
  res: Response
) => {
  const { serverId, urlId } = req.params;

  await service.servers.enableUrlById(req.authUser, {
    id: urlId,
    serverId,
  });

  const success = ApiSuccess.noContent({ data: null });
  return res.status(success.statusCode).json(getSuccessResponse(success));
};

const disableServerUrl = async (
  req: TypedRequest<typeof validation.servers.disableUrl>,
  res: Response
) => {
  await service.servers.disableUrlById(req.authUser);

  const success = ApiSuccess.noContent({ data: null });
  return res.status(success.statusCode).json(getSuccessResponse(success));
};

export const serversController = {
  createServer,
  createServerUrl,
  deleteServer,
  deleteServerUrl,
  disableServerUrl,
  enableServerUrl,
  getServerDetail,
  getServerList,
  refreshServer,
  scanServer,
  updateServer,
};