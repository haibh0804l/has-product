import '../../assets/css/index.css'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Layout, Segmented, Select, Space } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import Icon from '@ant-design/icons'
import { ReactComponent as Gold } from '../../assets/img/bling-gold.svg'
import { ReactComponent as Silver } from '../../assets/img/bling-silver.svg'
import { ReactComponent as Bronze } from '../../assets/img/bling-bronze.svg'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import {
  TrustScoreRequest,
  TrustScoreResponse,
} from '../../data/database/Report'
import { getCookie } from 'typescript-cookie'
import { fetchTrustScore } from '../../redux/features/report/trustScoreSlice'

const { Content } = Layout

interface DataType {
  key: string
  rank: React.ReactNode
  name: React.ReactNode
  department: React.ReactNode
  score: React.ReactNode
}

interface ScoreRankingInput {
  reloadCount: number
}

interface ScoreRankingMedal {
  index: number
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    align: 'center',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Department',
    dataIndex: 'department',
    align: 'center',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    align: 'center',
  },
]
const MedalIcon: React.FC<ScoreRankingMedal> = ({ index }) => {
  if (index === 1) {
    return <Icon component={Gold} style={{ fontSize: '20px' }} />
  } else if (index === 2) {
    return <Icon component={Silver} style={{ fontSize: '20px' }} />
  } else if (index === 3) {
    return <Icon component={Bronze} style={{ fontSize: '20px' }} />
  } else {
    return <p>{index}</p>
  }
}

const TrustRanking: React.FC<ScoreRankingInput> = ({ reloadCount }) => {
  const trustScore: TrustScoreRequest = {
    reporter: getCookie('user_id'),
  }
  const [tableData, setTableData] = useState<DataType[]>([])
  const [reload, setReload] = useState(reloadCount)
  const score = useAppSelector((state) => state.trustScore)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setReload(reload + 1)
  }, [])

  useEffect(() => {
    dispatch(fetchTrustScore(trustScore))
  }, [reload, reloadCount])

  useEffect(() => {
    if (!score.loading && score.score.length !== undefined) {
      MappingTableData(score.score)
    }
  }, [score.loading, score.score.length])

  const MappingTableData = (trustScoreResponse: TrustScoreResponse[]) => {
    let data: DataType[] = []
    for (let index = 0; index < trustScoreResponse.length; index++) {
      const element = trustScoreResponse[index]
      data.push({
        rank: <MedalIcon index={index + 1} />,
        name: <p>{element.LastName + ' ' + element.FirstName}</p>,
        department: <p>{element.Department}</p>,
        score: <p>{element.Score}</p>,
        key: element.Rank + ' ' + element.Score!,
      })
    }
    setTableData(data)
  }

  return (
    <Card
      title="Trust ranking"
      style={{ width: '100%' }}
      headStyle={{ backgroundColor: '#eeeeee' }}
      extra={
        <>
          <FontAwesomeIcon
            icon={faRefresh}
            size="lg"
            style={{ marginRight: '10px', cursor: 'pointer' }}
            onClick={() => setReload(reload + 1)}
          />
          {/* <FontAwesomeIcon icon={faExpand} size={'lg'} /> */}
        </>
      }
      onResize={(e) => console.log(e)}
    >
      <Table
        rowClassName={(record, index) => {
          return 'custom-table-row'
        }}
        pagination={{ pageSize: 5 }}
        columns={columns}
        dataSource={tableData}
        size="small"
      />
    </Card>
  )
}

export default TrustRanking
