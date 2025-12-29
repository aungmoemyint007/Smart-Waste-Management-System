import { Menu, Avatar, Switch } from '@mantine/core';
import {
  IconMessageCircle,
  IconUserCircle,
  IconFileText,
  IconMoon,
  IconMoonStars,
  IconSun,
  IconLogout2,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add axios for logout API call
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '@/Slices/UserSlice';
import { removeJwt } from '@/Slices/JwtSlice';
import ProfileDetails from './ProfileDetails';

const ProfileMenu = () => {
  const [opened, setOpened] = useState(false);
  const [op, setOp] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(removeUser());
    dispatch(removeJwt());
    navigate('/login');
  }

  return (
    <>
      <Menu opened={opened} onChange={setOpened} shadow="md" width={200}>
      <Menu.Target>
        <div className="flex cursor-pointer items-center gap-2">
          <div>{user.name}</div>
          <Avatar
            src={user.picture ? `http://localhost:8000/storage/${user.picture}` : "/avatar.png"}
            alt="it's me"
          />
        </div>
      </Menu.Target>

      <Menu.Dropdown onChange={() => setOpened(true)}>
        
          <Menu.Item leftSection={<IconUserCircle size={14} />} onClick={()=>setOp(true)}>
            Profile
          </Menu.Item>
        
        <Menu.Divider />
        <Menu.Item
          color="red"
          onClick={handleLogout}
          leftSection={<IconLogout2 size={14} />}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
    {op && <div className="z-[999] fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <ProfileDetails setOp={setOp} />
      </div>}
    </>
  );
};

export default ProfileMenu;