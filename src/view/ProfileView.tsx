import Card from "../components/Card"
import config from "../../config";
import { useEffect, useState } from "react";
import request from "umi-request";
import { marked } from "marked";
import Skeleton from "../components/Skeleton";
import Animation from "../components/Animation";

export default function ProfileView() {
  const { Name, Desc, ProfileMD, GithubUsername, Avatar } = config;
  const [introduce, setIntroduce] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!ProfileMD) {
      return
    }
    request.get(
      ProfileMD === "Github" ?
        `https://raw.githubusercontent.com/${GithubUsername}/${GithubUsername}/main/readme.md`
        : ProfileMD
    ).then((res) => {
      setIntroduce(marked.parse(res))
    }).catch((err) => {
      setIntroduce(err)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <Animation id="profile">
      <div className="flex flex-col justify-between items-center mb-10 p-4">
        <img src={Avatar} title={Name} className="h-32 w-32 rounded-full ring-2 ring-slate-400 mb-3" />
        <div className="text-center mt-4 md:mt-0  flex flex-col w-3/4 md:w-1/2">
          <h1 className="text-2xl font-semibold mb-2">{Name}</h1>
          <p className="text-gray-500 ">{Desc}</p>
        </div>
      </div>
      {
        ProfileMD ?
          loading ?
            <Skeleton></Skeleton>
            :
            < Card
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: introduce }} />
          : null
      }
    </Animation>
  )
}



