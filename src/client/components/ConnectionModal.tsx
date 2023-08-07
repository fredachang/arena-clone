import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useCreateConnection } from "../hooks/connections/useCreateConnection";
import { useGetChannels } from "../hooks/channels/useGetChannels";
import React from "react";

interface Props {
  blockId: string;
  channelTitle: string;
  handleCloseConnect: () => void;
}

export const ConnectionModal = (props: Props) => {
  const { handleCloseConnect, blockId, channelTitle } = props;
  const [input, setInput] = useState("");

  const { data: channels } = useGetChannels();

  const createConnectionMutation = useCreateConnection(blockId);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuthContext();
  const userName = `${profile?.firstName}-${profile?.lastName}`;

  const handleFilterList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInput(input);
  };

  const filteredChannels = React.useMemo(() => {
    const filteredList =
      channels?.filter((channel) =>
        channel.title.toLowerCase().includes(input.toLowerCase())
      ) ?? [];

    return filteredList;
  }, [channels, input]);

  // const filterList = (input: string) => {
  //   setFilteredChannels(filteredList || []);
  // };

  const handleClickChannel = (channelId: string, isPrivate: boolean) => {
    const variables = {
      channelId: channelId,
      blockId: blockId,
    };

    createConnectionMutation.mutateAsync(variables).then(() => {
      const currentPath = location.pathname;

      let targetUrl: string;

      switch (currentPath) {
        case `/channels/${userName}`:
          targetUrl = `/channels/${userName}`;
          break;
        case `/blocks/${userName}`:
          targetUrl = `/blocks/${userName}`;
          break;
        case `/channels/${userName}/${channelTitle}/${channelId}/${isPrivate}`:
          targetUrl = `/channels/${userName}/${channelTitle}/${channelId}/${isPrivate}`;
          break;
        default:
          targetUrl = `/channels/${userName}`;
      }

      navigate(targetUrl, { replace: true });
      setInput("");
      handleCloseConnect();
    });
  };

  return (
    <>
      <div className="bg-slate-200 w-full h-full">
        <p>Connection Modal</p>
        <input
          type="text"
          placeholder="Type to filter..."
          value={input}
          onChange={handleFilterList}
        />
        <ul>
          {filteredChannels.map((channel) => (
            <div key={channel.id}>
              <button
                onClick={() =>
                  handleClickChannel(channel.id, channel.isPrivate)
                }
              >
                {channel.title}
              </button>
            </div>
          ))}
        </ul>

        <button className="text-center" onClick={handleCloseConnect}>
          Close
        </button>
      </div>
    </>
  );
};
